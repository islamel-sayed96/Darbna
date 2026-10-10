<?php

namespace App\Support;

class VideoUrl
{
    public static function extractYoutubeId(string $url): ?string
    {
        $pattern = '/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/';

        return preg_match($pattern, $url, $matches) ? $matches[1] : null;
    }
}
