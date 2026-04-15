export default function LiquidGlassFilter() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <filter id="liquid-glass-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blurred" />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.004"
            numOctaves="4"
            seed="3"
            result="noise"
          />

          <feDisplacementMap
            in="blurred"
            in2="noise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="liquid-glass-active" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blurred" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.006"
            numOctaves="3"
            seed="12"
            result="noise"
          />
          <feDisplacementMap
            in="blurred"
            in2="noise"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
