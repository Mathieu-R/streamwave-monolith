declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['stw-tracklist']: HtmlTag
      ['stw-download-switch']: HtmlTag
      ['stw-track']: HtmlTag
      ['stw-player']: HtmlTag
      ['stw-progress']: HtmlTag
      ['stw-volume']: HtmlTag
    }

    interface HtmlTag {
      ['up-main']?: boolean
      ['up-hungry']?: boolean
      ['up-source']?: string
      ['load-fragment']?: boolean
    }

    interface HtmlAnchorTag {
      ['up-follow']?: boolean
      ['up-target']?: string
      ['up-layer']?: 'new' | 'swap' | 'shatter'
      ['up-accept-location']?: string
      ['up-mode']?: 'root' | 'modal' | 'drawer' | 'popup' | 'cover'
      ['up-on-accepted']?: string
    }

    interface HtmlFormTag {
      ['up-submit']?: boolean
      ['up-target']?: string
    }
  }
}
