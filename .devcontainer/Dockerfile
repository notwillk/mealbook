FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG DEBIAN_FRONTEND=noninteractive

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        jq \
        xz-utils \
        yq \
        ; \
    rm -rf /var/lib/apt/lists/*

COPY versions.yaml /tmp/versions.yaml

RUN set -eux; \
    node_version="$(yq -r '.node' /tmp/versions.yaml)"; \
    pnpm_version="$(yq -r '.pnpm' /tmp/versions.yaml)"; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
        amd64) node_arch='linux-x64';; \
        arm64) node_arch='linux-arm64';; \
        *) echo "Unsupported architecture: $arch" >&2; exit 1;; \
    esac; \
    curl -fsSL "https://nodejs.org/dist/v${node_version}/node-v${node_version}-${node_arch}.tar.xz" -o /tmp/node.tar.xz; \
    tar --strip-components=1 -xJf /tmp/node.tar.xz -C /usr/local; \
    rm /tmp/node.tar.xz; \
    npm install -g "pnpm@${pnpm_version}"; \
    rm -rf /root/.npm/_cacache; \
    rm /tmp/versions.yaml
