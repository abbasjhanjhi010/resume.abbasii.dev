Push to `main` triggers [.github/workflows/deploy.yaml](.github/workflows/deploy.yaml):

1. `nix build .#for-production` — this is **not** the same as `zola build`. The `for-production` package in [flake.nix](flake.nix) overrides `base_url` to `https://resume.abbasii.dev/` at build time, overriding whatever's in `zola.toml`. If URLs look wrong in a deploy, check here first, not `zola.toml`.
2. The build output (`result/`) is uploaded via `actions/upload-pages-artifact` and deployed via `actions/deploy-pages` — GitHub's native Pages flow, w/o SSH/secrets.
3. The subdomain (`resume.abbasii.dev`) comes from `static/CNAME` — it has to live in `static/`, not repo root, or Zola won't copy it into the build output and the domain association breaks on next deploy.

Pages source in repo settings must be "GitHub Actions," not "Deploy from a branch."