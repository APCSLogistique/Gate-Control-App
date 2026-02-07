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
|API_BASE_URL| Http URL to the API layer (backend)|
|API_SERVICE_TOKEN| Service Token so that the service authenticates to the main backend|
|OLLAMA_BASE_URL| Http URL to the Ollama LLM Server|
|OLLAMA_MODEL| Ollama Model Name|


### Development / Production

This Service uses dependency injection to promote easily switching the LLM Providers from a cloud based provider like Gemini to a production ready Local LLM like Ollama 2

> [!WARN] Llama Compatibility
> The Llama API Included here is immature and hasnt had any formal testing and is still considered experimental


### API Specification

The AI Service exposes 1 REST Endpoint

- `POST /api/ai/generate`

> This endpoint is responsible for the generation of 1 ai answer

Example Request Body:

```json
{
    "chat_id": "C1234",
    "user_id": "U12054-0220",
    "message": "What is the availability tomorrow at 8 pm."
}
```


Example Response Body:

```json
{
    "message": "Sure thing, the availability on the 07-02-2026 at 8pm is quite good, since there is only 8 bookings out of the maximum amount of 15..."

}
```