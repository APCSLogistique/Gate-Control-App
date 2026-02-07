<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class InitDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Db:init';

    /**
     * The console command description.
     *
     * @var string
     */

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize database with roles, permissions and admin user';



    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting database initialization...');

        $this->createAdmin();

        $this->info('Database initialized successfully!');
    }


    public function createAdmin()
    {
        $this->info('Creating admin user...');

        $Name =  $this->ask('Name');
        $email = 'admin@gmail.com';
        $password = $this->secret('Password');

        User::create([
            'name' => $Name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin'
        ]);

        $this->info('<fg=green>✓ Admin user created successfully');
    }
}
