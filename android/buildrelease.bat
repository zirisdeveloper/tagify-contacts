
@echo off
echo Attempting to build release with normal settings...
call gradlew assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo Normal build failed, trying with offline mode...
    call gradlew assembleRelease --offline
    
    if %ERRORLEVEL% NEQ 0 (
        echo Offline build failed as well.
        echo Trying with extended timeout and max attempts...
        call gradlew assembleRelease --stacktrace --info -Dorg.gradle.internal.http.socketTimeout=360000 -Dorg.gradle.internal.http.connectionTimeout=360000 -Dorg.gradle.internal.repository.max.retries=10
    )
)
