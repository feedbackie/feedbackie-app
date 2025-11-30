<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DeployCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:deploy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $adminsCount = User::query()
            ->where('is_super_admin', true)
            ->count();

        if ($adminsCount > 0) {
            $this->info('Users table is not empty, skipping deployment');

            return self::FAILURE;
        }

        $this->call('app:create-admin-user');

        $this->call('app:download-geoip-db');

        return self::SUCCESS;
    }
}
