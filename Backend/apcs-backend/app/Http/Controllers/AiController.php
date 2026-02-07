<?php


namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;


class AiController extends Controller
{
    public function generateMessage(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|string',
            'message' => 'required|string',
        ]);

        // Remove 'chat_' prefix if present
        $chatId = str_replace('chat_', '', $request->chat_id);

        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json(['error' => 'Chat not found'], 404);
        }

        // Check if user owns the chat
        if ($chat->user_id !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get current message count for index
        $messageCount = Message::where('chat_id', $chatId)->count();

        // Save user message to Laravel DB
        $userMessage = Message::create([
            'chat_id' => $chatId,
            'sender' => 'human',
            'message' => $request->message,
            'index' => $messageCount,
        ]);

        try {
            // Get all chat messages to send to Python
            $allMessages = Message::where('chat_id', $chatId)
                ->orderBy('index')
                ->get()
                ->map(function ($msg) {
                    return [
                        'sender' => $msg->sender,
                        'message' => $msg->message,
                        'index' => $msg->index,
                        'created_at' => $msg->created_at->toIso8601String(),
                    ];
                })
                ->toArray();

            // Call Python API with all messages (NO API KEY)
            $aiResponse = $this->callPythonAPI(
                $request->chat_id,
                $request->message,
                Auth::user(),
                $allMessages
            );

            // Save AI response to Laravel DB
            $aiMessage = Message::create([
                'chat_id' => $chatId,
                'sender' => 'agent',
                'message' => $aiResponse,
                'index' => $messageCount + 1,
            ]);

            return response()->json([
                'message' => $aiResponse,
                'message_id' => (string) $aiMessage->id,
                'index' => $aiMessage->index,
            ]);
        } catch (\Exception $e) {
            // Return error response
            return response()->json([
                'error' => 'AI service unavailable',
                'message' => 'Unable to generate response. Please try again later.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 503);
        }
    }

    /**
     * Call Python API endpoint with all chat messages
     * Simple HTTP POST - NO API KEY
     */
    private function callPythonAPI($chatId, $currentMessage, $user, $allMessages)
    {
        // Get Python API URL
        $pythonApiUrl = config('services.ai.url', env('AI_SERVICE_URL', 'http://localhost:8001/api'));
        $timeout = config('services.ai.timeout', env('AI_SERVICE_TIMEOUT', 30));

        // Payload with all chat messages
        $payload = [
            'chat_id' => $chatId,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role,
            'message' => $currentMessage,
            'messages' => $allMessages,
        ];

        // Make simple HTTP POST request (NO Authorization header)
        /** @var Response $response */
        $response = Http::timeout($timeout)
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post($pythonApiUrl . '/chat', $payload);

        // Check if request was successful
        if (!$response->successful()) {
            throw new \Exception('Python API error: ' . $response->status() . ' - ' . $response->body());
        }

        $responseData = $response->json();

        // Extract the AI response
        return $responseData['message'] ?? $responseData['response'] ?? $responseData['content'] ?? 'No response from AI';
    }
}
