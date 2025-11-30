<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateAdminUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info("Creating suer user...");

        $password = config('app.admin.password');
        $email = config('app.admin.email');

        $adminUser = User::query()
            ->where('login', 'admin')
            ->first();

        if ($adminUser !== null) {
            $this->info('Admin user already exists!');
            return self::SUCCESS;
        }

        $user = new User();

        $user->fill([
            'name' => 'admin',
            'login' => 'admin',
            'email' => $email,
            'password' => $password,
        ]);
        $user->is_super_admin = true;

        $user->save();

        $this->info('Admin user created successfully!');
        $this->info(str_repeat("=", 24));
        $this->info("Login: " . $user->login);
        $this->info("Password: " . $password);
        $this->info(str_repeat("=", 24));

        return self::SUCCESS;
    }
}
