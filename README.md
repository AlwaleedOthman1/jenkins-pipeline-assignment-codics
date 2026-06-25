# DevOps Assignment App

Simple Node.js app for testing this flow:

GitHub push -> Jenkins auto-build -> Jenkins updates Jira -> Jenkins builds Docker image -> Jenkins pushes image to Docker Hub.

## Run Locally

```powershell
npm install
npm test
npm start
```

Open:

```text
http://localhost:3000
http://localhost:3000/health
```

## Docker


```powershell
docker build -t yourdockerhubusername/devops-assignment-app:latest .
docker run -p 3000:3000 yourdockerhubusername/devops-assignment-app:latest
```

## Jenkins Setup Notes

Before running the pipeline, update these values in `Jenkinsfile`:

- `JIRA_ISSUE`: your Jira issue key, for example `DEVOPS-1`
- `JIRA_BASE_URL`: your Jira Cloud URL, for example `https://your-site.atlassian.net`
- `JIRA_SITE`: your Jira Cloud site for Jenkins build info, for example `your-site.atlassian.net`
- `JIRA_CREDS`: Jenkins credential ID for Jira Cloud, expected as `jira-cloud`
- `DOCKER_IMAGE`: your Docker Hub image, for example `yourdockerhubusername/devops-assignment-app`
- `DOCKER_CREDS`: Jenkins credential ID for Docker Hub, expected as `dockerhub`

Create the `jira-cloud` Jenkins credential as:

- Kind: Username with password
- Username: your Atlassian account email
- Password: Atlassian API token
- ID: `jira-cloud`

Required Jenkins plugins:

- Git
- GitHub
- Pipeline
- Docker Pipeline
- Credentials Binding
- Jira
- Atlassian Jira Software Cloud
- HTML Publisher
- Performance Plugin

Use a branch name and commit message containing the Jira issue key, for example:

```powershell
git checkout -b DEVOPS-1-jenkins-pipeline
git add .
git commit -m "DEVOPS-1 add Jenkins pipeline and Dockerfile"
git push origin DEVOPS-1-jenkins-pipeline
```

## JMeter

A basic JMeter test plan is included at `test/load-test.jmx`. It targets:

```text
http://localhost:3000/health
```
