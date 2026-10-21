<?php

namespace App\Support;

class VideoUrl
{
    public static function extractYoutubeId(string $url): ?string
    {
        $pattern = '/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/';

        return preg_match($pattern, $url, $matches) ? $matches[1] : null;
    }

    /**
     * Provider + id for a lecture recording link. YouTube links get
     * embedded inline; anything else (Zoom cloud recordings included)
     * can't be embedded reliably, so it's kept as an outbound link.
     */
    public static function detectProvider(string $url): array
    {
        if ($id = self::extractYoutubeId($url)) {
            return ['video_provider' => 'youtube', 'video_id' => $id];
        }

        return ['video_provider' => 'external', 'video_id' => null];
    }
}
