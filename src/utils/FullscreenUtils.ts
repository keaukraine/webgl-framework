export class FullScreenUtils {
    /** Enters fullscreen. */
    enterFullScreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    }

    /** Exits fullscreen */
    exitFullScreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    /**
     * Adds cross-browser fullscreenchange event
     *
     * @param exitHandler Function to be called on fullscreenchange event
     */
    addFullScreenListener(exitHandler: () => any): void {
        document.addEventListener('fullscreenchange', exitHandler, false);
    }

    /**
     * Checks fullscreen state.
     *
     * @return `true` if fullscreen is active, `false` if not
     */
    isFullScreen(): boolean {
        return !!document.fullscreenElement;
    }
}
