<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CourseReviewController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InstructorApplicationController as AdminInstructorApplicationController;
use App\Http\Controllers\Admin\InstructorController;
use App\Http\Controllers\Admin\LearningPathController as AdminLearningPathController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Instructor\CourseController as InstructorCourseController;
use App\Http\Controllers\Instructor\CourseSectionController;
use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\LessonController;
use App\Http\Controllers\InstructorApplicationController;
use App\Http\Controllers\LearningPathController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\LessonViewController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/terms', fn () => Inertia::render('Legal/Terms'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('Legal/Privacy'))->name('privacy');

Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])->name('courses.show');
Route::get('/lessons/{lesson}', [LessonViewController::class, 'show'])->name('lessons.show');
Route::get('/pricing', [PricingController::class, 'index'])->name('pricing');
Route::get('/learning-paths', [LearningPathController::class, 'index'])->name('learning-paths.index');
Route::get('/learning-paths/{learningPath:slug}', [LearningPathController::class, 'show'])->name('learning-paths.show');
Route::get('/become-instructor', [InstructorApplicationController::class, 'create'])->name('instructor-application.create');
Route::post('/become-instructor', [InstructorApplicationController::class, 'store'])->name('instructor-application.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'redirect'])->name('dashboard');

    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->name('courses.enroll');
    Route::post('/lessons/{lesson}/complete', [LessonProgressController::class, 'store'])->name('lessons.complete');

    Route::post('/checkout/{plan}', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/{payment}/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/{payment}/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/instructors', [InstructorController::class, 'index'])->name('instructors.index');
        Route::get('/instructors/create', [InstructorController::class, 'create'])->name('instructors.create');
        Route::post('/instructors', [InstructorController::class, 'store'])->name('instructors.store');
        Route::post('/instructors/{instructor}/toggle-active', [InstructorController::class, 'toggleActive'])->name('instructors.toggle-active');

        Route::get('/staff', [StaffController::class, 'index'])->name('staff.index');
        Route::get('/staff/create', [StaffController::class, 'create'])->name('staff.create');
        Route::post('/staff', [StaffController::class, 'store'])->name('staff.store');
        Route::put('/staff/{staff}/permissions', [StaffController::class, 'updatePermissions'])->name('staff.permissions');
        Route::post('/staff/{staff}/toggle-active', [StaffController::class, 'toggleActive'])->name('staff.toggle-active');

        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('/learning-paths', [AdminLearningPathController::class, 'index'])->name('learning-paths.index');
        Route::get('/learning-paths/{learningPath}', [AdminLearningPathController::class, 'show'])->name('learning-paths.show');
        Route::post('/learning-paths', [AdminLearningPathController::class, 'store'])->name('learning-paths.store');
        Route::put('/learning-paths/{learningPath}', [AdminLearningPathController::class, 'update'])->name('learning-paths.update');
        Route::delete('/learning-paths/{learningPath}', [AdminLearningPathController::class, 'destroy'])->name('learning-paths.destroy');

        Route::get('/instructor-applications', [AdminInstructorApplicationController::class, 'index'])->name('instructor-applications.index');
        Route::post('/instructor-applications/{instructorApplication}/approve', [AdminInstructorApplicationController::class, 'approve'])->name('instructor-applications.approve');
        Route::post('/instructor-applications/{instructorApplication}/reject', [AdminInstructorApplicationController::class, 'reject'])->name('instructor-applications.reject');
    });

    // Content moderation — admin (via its synced permissions) or any
    // moderator explicitly granted the 'review_courses' permission.
    Route::middleware('permission:review_courses')->group(function () {
        Route::get('/courses', [CourseReviewController::class, 'index'])->name('courses.index');
        Route::get('/courses/{course}', [CourseReviewController::class, 'show'])->name('courses.show');
        Route::post('/courses/{course}/approve', [CourseReviewController::class, 'approve'])->name('courses.approve');
        Route::post('/courses/{course}/reject', [CourseReviewController::class, 'reject'])->name('courses.reject');
        Route::post('/courses/{course}/unpublish', [CourseReviewController::class, 'unpublish'])->name('courses.unpublish');
        Route::post('/courses/{course}/learning-path', [CourseReviewController::class, 'assignLearningPath'])->name('courses.assign-learning-path');
        Route::delete('/courses/{course}', [CourseReviewController::class, 'destroy'])->name('courses.destroy');
    });
});

Route::middleware(['auth', 'verified', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/', [InstructorDashboardController::class, 'index'])->name('dashboard');

    Route::get('/courses', [InstructorCourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [InstructorCourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [InstructorCourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/edit', [InstructorCourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [InstructorCourseController::class, 'update'])->name('courses.update');
    Route::post('/courses/{course}/submit', [InstructorCourseController::class, 'submit'])->name('courses.submit');

    Route::post('/courses/{course}/sections', [CourseSectionController::class, 'store'])->name('sections.store');
    Route::put('/sections/{section}', [CourseSectionController::class, 'update'])->name('sections.update');
    Route::delete('/sections/{section}', [CourseSectionController::class, 'destroy'])->name('sections.destroy');

    Route::post('/sections/{section}/lessons', [LessonController::class, 'store'])->name('lessons.store');
    Route::put('/lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');
});

Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/', [StudentDashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/auth.php';
