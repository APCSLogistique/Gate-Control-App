## AI Service APCS

The AI service for the Gate control system is a gateway to an AI agent/assistant that helps with the following issues:
- Availability Checks
- Booking Questions
- Rescheduling Help

### Setting Up

You can build the AI Service via its docker file

```bash
docker run -d \
  --name ai-service \
  -p 8001:8001 \
  --env-file .env \
  micro-hack-ai-api
```

This will expose port 8001 for contacting the API through HTTPS connection

> You must link the .env file

### Environment variables

This Service relies on the following Environement variables

|Variable|Value|
|:------:|:---:|
|API_BASE_URL||