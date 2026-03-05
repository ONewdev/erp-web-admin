<?php
// backend/config/app.php

// Application configuration
// Store secrets, constants, and other environment variables

function getAppSecret() {
    // You can override this via .env file using `JWT_SECRET=yoursecret`
    $envSecret = getenv('JWT_SECRET');
    return $envSecret ?: 'bci_qsoft_default_dev_secret_key_8273645!';
}
?>
