<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
            'role' => 'required|string|in:transiter,operator,admin'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'name is required',
            'name.string' => 'the name should be a string',
            'email.required' => 'email is required',
            'email.string' => 'the email should be a string',
            'email.email' => 'the email should be a valid email address',
            'email.max' => 'the email should not exceed 255 characters',
            'email.unique' => 'the email has already been taken',
            'password.required' => 'password is required',
            'password.string' => 'the password should be a string',
            'role.required' => 'role is required',
            'role.string' => 'the role should be a string',
            'role.in' => 'the role must be one of the following: transiter, operator, admin',
        ];
    }
}
