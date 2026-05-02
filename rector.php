<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList as CoreSetList;

return RectorConfig::configure()
    ->withSets([
        \RectorLaravel\Set\LaravelSetList::LARAVEL_CODE_QUALITY,
        CoreSetList::TYPE_DECLARATION,
    ])
    ->withRules([
        \Rector\TypeDeclaration\Rector\StmtsAwareInterface\DeclareStrictTypesRector::class,
        \RectorLaravel\Rector\StaticCall\EloquentMagicMethodToQueryBuilderRector::class,
    ])
    ->withPaths([
        'app',
        'config',
        'database',
        'routes',
        'tests',
        'packages',
    ])
    ->withImportNames()
    ;
