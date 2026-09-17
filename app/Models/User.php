<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'bio', 'headline', 'avatar_path'])]
#[Hidden(['password', 'remember_token'])]
#[Appends(['avatar_url'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    protected function avatarUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function coursesTaught(): HasMany
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function liveSessionsHosted(): HasMany
    {
        return $this->hasMany(LiveSession::class, 'instructor_id');
    }

    public function liveSessionBookings(): HasMany
    {
        return $this->hasMany(LiveSessionBooking::class);
    }

    public function activeSubscription(): ?Subscription
    {
        return $this->activeSubscriptions()->first();
    }

    /**
     * @return \Illuminate\Support\Collection<int, Subscription>
     */
    public function activeSubscriptions()
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where('ends_at', '>', now())
            ->latest('ends_at')
            ->get();
    }

    public function hasAccessToCourse(Course $course): bool
    {
        if ($course->is_free) {
            return true;
        }

        return $this->activeSubscriptions()
            ->contains(fn (Subscription $subscription) => $subscription->grantsAccessToCourse($course));
    }
}
