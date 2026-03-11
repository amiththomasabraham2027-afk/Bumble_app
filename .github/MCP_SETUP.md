# MCP Server Setup for AWS EC2 Deploy Agent

This file documents how to configure the two MCP servers used by the
`aws-ec2-deploy` agent. Add the entries below to your VS Code
**User Settings** (`Ctrl+Shift+P` → *Open User Settings (JSON)*) under the
`"github.copilot.chat.mcp.servers"` key, **or** place them in a
`.vscode/mcp.json` file at the workspace root.

---

## 1. GitHub MCP Server

Repository: https://github.com/github/github-mcp-server

```json
{
  "github.copilot.chat.mcp.servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-github-pat>"
      }
    }
  }
}
```

**Required PAT scopes:** `repo`, `workflow`, `read:org`

Create a token at: https://github.com/settings/tokens

---

## 2. AWS Labs MCP Servers

Repository: https://github.com/awslabs/mcp

AWS Labs publishes a collection of purpose-built MCP servers. For EC2
deployment, the most useful are:

### aws-documentation-mcp-server
Lets the agent search AWS documentation directly.

```json
"awslabs.aws-documentation-mcp-server": {
  "command": "uvx",
  "args": ["awslabs.aws-documentation-mcp-server@latest"],
  "env": {
    "FASTMCP_LOG_LEVEL": "ERROR"
  }
}
```

### aws-cdk-mcp-server
Generates and validates AWS CDK infrastructure constructs.

```json
"awslabs.cdk-mcp-server": {
  "command": "uvx",
  "args": ["awslabs.cdk-mcp-server@latest"],
  "env": {
    "FASTMCP_LOG_LEVEL": "ERROR"
  }
}
```

### aws-core-mcp-server (orchestrator)
Routes requests across all other AWS Labs MCP servers automatically.

```json
"awslabs.core-mcp-server": {
  "command": "uvx",
  "args": ["awslabs.core-mcp-server@latest"],
  "env": {
    "FASTMCP_LOG_LEVEL": "ERROR"
  }
}
```

---

## Complete `.vscode/mcp.json` example

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_PAT}"
      }
    },
    "awslabs.aws-documentation-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "awslabs.cdk-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.cdk-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "awslabs.core-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.core-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```

> **Tip:** Store secrets in environment variables (e.g. `GITHUB_PAT`,
> `AWS_ACCESS_KEY_ID`) rather than pasting them directly into JSON.
> Use a `.env` file + `direnv`, or Windows environment variables, to inject them.

---

## Prerequisites

| Tool | Install command |
|------|----------------|
| Node.js 18+ | https://nodejs.org |
| Python 3.11+ + `uv` | `pip install uv` or https://github.com/astral-sh/uv |
| AWS CLI v2 | https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html |
| Docker Desktop | https://www.docker.com/products/docker-desktop |
