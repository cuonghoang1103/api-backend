#!/bin/bash
set -e
# Fix AI model env vars: remove surrounding double-quotes from value strings
# The .env file has values like: GROQ_CHAT_MODEL="llama-3.1-8b-instant"
# The quotes get passed directly to API calls and rejected as invalid model IDs

# Strip the double-quotes around the value for each model env var
perl -i -pe 's/^(GROQ_CHAT_MODEL|OPENROUTER_CHAT_MODEL|OPENAI_CHAT_MODEL|AI_CHAT_MODEL)="(.*)"/$1=$2/' /opt/cuonghoangdev/.env

echo "Fixed env vars:"
grep -E '^(GROQ_CHAT_MODEL|OPENROUTER_CHAT_MODEL|OPENAI_CHAT_MODEL|AI_CHAT_MODEL)=' /opt/cuonghoangdev/.env
