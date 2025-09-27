# Verena

Verena is your trusted and personalized AI Financial Assistant.

## Deployment

### Server Deployment

To deploy the server application, create and push a `deploy` tag:

```bash
git tag deploy
git push origin deploy
```

This will trigger the GitHub Actions workflow that:
1. Sets up Google Cloud SDK and Terraform
2. Installs dependencies 
3. Runs the deployment script in `packages/server`
4. Automatically deletes the deploy tag after completion

**Required Secrets:**
- `GCP_SA_KEY`: Google Cloud Service Account key (JSON)
- `NPM_ACCESS_TOKEN`: NPM token for accessing private packages

**Required GCP Permissions:**
- Storage Admin (for GCR access)
- Cloud Run Admin
- Service Account User  
- Compute Admin (for terraform resources)
- IAM Service Account Admin (for terraform)

## TODO
- Verify Android app works
- Create a /support page that outlines how you can delete your account and your information
- Apple SSO
- Google SSO
