<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    /**
     * GET /api/chat
     * Creates a new chat
     */
    public function createChat()
    {
        $chat = Chat::create([
            'user_id' => Auth::user()->user_id,
        ]);

        return response()->json([
            'chat_id' => 'chat_' . $chat->chat_id,
            'user_id' => $chat->user_id,
            'created_at' => $chat->created_at,
        ], 201);
    }

    /**
     * GET /api/chat/:chatid/messages
     * Gets messages from a chat
     */
    public function getChatMessages($chatId)
    {
        // Remove 'chat_' prefix if present
        $chatId = str_replace('chat_', '', $chatId);

        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json(['error' => 'Chat not found'], 404);
        }

        // Check if user owns the chat
        if ($chat->user_id !== Auth::user()->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = Message::where('chat_id', $chatId)
            ->orderBy('index')
            ->get()
            ->map(function ($message) {
                return [
                    'message_id' => (string) $message->message_id,
                    'sender' => $message->sender,
                    'message' => $message->message,
                    'index' => $message->index,
                    'created_at' => $message->created_at,
                ];
            });

        return response()->json($messages);
    }

    /**
     * GET /api/chat/user
     * Gets all chats for the authenticated user
     */
    public function getUserChats()
    {
        $chats = Chat::where('user_id', Auth::user()->user_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($chat) {
                $lastMessage = Message::where('chat_id', $chat->chat_id)
                    ->orderBy('index', 'desc')
                    ->first();

                return [
                    'chat_id' => 'chat_' . $chat->chat_id,
                    'created_at' => $chat->created_at,
                    'last_message' => $lastMessage ? [
                        'message' => Str::limit($lastMessage->message, 50),
                        'sender' => $lastMessage->sender,
                        'created_at' => $lastMessage->created_at,
                    ] : null,
                ];
            });

        return response()->json($chats);
    }

    /**
     * DELETE /api/chat/:chatid
     * Deletes a chat and all its messages
     */
    public function deleteChat($chatId)
    {
        // Remove 'chat_' prefix if present
        $chatId = str_replace('chat_', '', $chatId);

        $chat = Chat::find($chatId);

        if (!$chat) {
            return response()->json(['error' => 'Chat not found'], 404);
        }

        // Check if user owns the chat
        if ($chat->user_id !== Auth::user()->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete all messages
        Message::where('chat_id', $chatId)->delete();

        // Delete the chat
        $chat->delete();

        return response()->json([
            'message' => 'Chat deleted successfully',
        ]);
    }
}
