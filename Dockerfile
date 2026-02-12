FROM rust:trixie AS rust

LABEL authors="jcake"

RUN mkdir -p "/app"
WORKDIR "/app"
COPY "./" "/app"

RUN apt update && apt upgrade -y && apt install jq -y

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cp $(cargo build --workspace --all-targets --release --message-format json | jq -sr '.[] | select(.reason == "compiler-artifact" and .executable).executable') /app/out

FROM node:trixie AS node

LABEL authors="jcake"

COPY --from=rust "/app" "/app"
WORKDIR "/app"
RUN npm install
RUN npm run build:release

FROM debian:trixie-slim AS tempalte

LABEL authors="jcake"

RUN mkdir -p "/etc/out"
COPY --from=rust "/app/out/*" "/usr/bin"
COPY --from=rust "/app/config.toml" "/etc/config.toml"

ENV RUST_LOG=info

ENTRYPOINT ["/bin/echo", "hello"]
