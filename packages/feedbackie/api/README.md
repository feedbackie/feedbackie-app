This package contains the api and mcp functionality for Feedbackie.

Installing using composer:

```
composer require feedbackie/api
```

After installing, add the following trait to the User model:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable 
{
    use HasApiTokens;
//... 
}
```
