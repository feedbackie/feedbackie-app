<?php

declare(strict_types=1);

namespace Feedbackie\Api\Enums;

enum TokenAbilitiesEnum: string
{
    case READ_SITES = 'read-sites';
    case READ_REPORTS = 'read-reports';
    case ACCEPT_REPORTS = 'accept-reports';
    case REJECT_REPORTS = 'reject-reports';
    case READ_FEEDBACK = 'read-feedback';

    public static function getAbilities(): array
    {
        return [
            self::READ_SITES->value => \__('feedbackie-api::labels.abilities.read_sites'),
            self::READ_REPORTS->value => \__('feedbackie-api::labels.abilities.read_reports'),
            self::READ_FEEDBACK->value => \__('feedbackie-api::labels.abilities.read_feedback'),
            self::ACCEPT_REPORTS->value => \__('feedbackie-api::labels.abilities.accept_reports'),
            self::REJECT_REPORTS->value => \__('feedbackie-api::labels.abilities.reject_reports'),
        ];
    }
}
