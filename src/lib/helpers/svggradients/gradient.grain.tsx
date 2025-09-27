export const BlueishRedGrain = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            gradientTransform="rotate(-219, 0.5, 0.5)"
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            id="gggrain-gradient2"
          >
            <stop stopColor="hsl(194, 83%, 49%)" stopOpacity="1" offset="-0%"></stop>
            <stop stopColor="rgba(255,255,255,0)" stopOpacity="0" offset="100%"></stop>
          </linearGradient>
          <linearGradient
            gradientTransform="rotate(219, 0.5, 0.5)"
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            id="gggrain-gradient3"
          >
            <stop stopColor="hsl(227, 100%, 50%)" stopOpacity="1"></stop>
            <stop stopColor="rgba(255,255,255,0)" stopOpacity="0" offset="100%"></stop>
          </linearGradient>
          <filter
            id="gggrain-filter"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.43"
              numOctaves="2"
              seed="2"
              stitchTiles="stitch"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="turbulence"
            ></feTurbulence>
            <feColorMatrix
              type="saturate"
              values="0"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="turbulence"
              result="colormatrix"
            ></feColorMatrix>
            <feComponentTransfer
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="colormatrix"
              result="componentTransfer"
            >
              <feFuncR type="linear" slope="3"></feFuncR>
              <feFuncG type="linear" slope="3"></feFuncG>
              <feFuncB type="linear" slope="3"></feFuncB>
            </feComponentTransfer>
            <feColorMatrix
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="componentTransfer"
              result="colormatrix2"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 24 -16"
            ></feColorMatrix>
          </filter>
        </defs>
        <g>
          <rect width="100%" height="100%" fill="hsl(0, 100%, 60%)"></rect>
          <rect width="100%" height="100%" fill="url(#gggrain-gradient3)"></rect>
          <rect width="100%" height="100%" fill="url(#gggrain-gradient2)"></rect>
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            filter="url(#gggrain-filter)"
            className="mix-blend-soft-light opacity-80"
          ></rect>
        </g>
      </svg>
    );
};
  

export const BlueishhPurpleGrain = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className="w-full h-full"
    >
      <defs>
        <linearGradient
          gradientTransform="rotate(-138, 0.5, 0.5)"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="gggrain-gradient2"
        >
          <stop stopColor="hsla(213, 74%, 56%, 1.00)" stopOpacity="1" offset="-0%"></stop>
          <stop stopColor="rgba(255,255,255,0)" stopOpacity="0" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          gradientTransform="rotate(138, 0.5, 0.5)"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="gggrain-gradient3"
        >
          <stop stopColor="hsl(290, 77%, 12%)" stopOpacity="1"></stop>
          <stop stopColor="rgba(255,255,255,0)" stopOpacity="0" offset="100%"></stop>
        </linearGradient>
        <filter
          id="gggrain-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.42"
            numOctaves="2"
            seed="178"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feColorMatrix
            type="saturate"
            values="0"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            result="colormatrix"
          ></feColorMatrix>
          <feComponentTransfer
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="colormatrix"
            result="componentTransfer"
          >
            <feFuncR type="linear" slope="3"></feFuncR>
            <feFuncG type="linear" slope="3"></feFuncG>
            <feFuncB type="linear" slope="3"></feFuncB>
          </feComponentTransfer>
          <feColorMatrix
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="componentTransfer"
            result="colormatrix2"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 25 -17"
          ></feColorMatrix>
        </filter>
      </defs>
      <g>
        <rect width="100%" height="100%" fill="hsl(239, 100%, 60%)"></rect>
        <rect width="100%" height="100%" fill="url(#gggrain-gradient3)"></rect>
        <rect width="100%" height="100%" fill="url(#gggrain-gradient2)"></rect>
        <rect
          width="100%"
          height="100%"
          fill="transparent"
          filter="url(#gggrain-filter)"
          className="mix-blend-soft-light opacity-75"
        ></rect>
      </g>
    </svg>
  );
};


type RenderGradientType = {
    type: 'blueishred' | 'blueishpurple'
}

export const RenderGradient = ( { type } : RenderGradientType ) => {
    switch ( type ) {
        case 'blueishred':
            return <BlueishRedGrain />
        case 'blueishpurple':
            return <BlueishhPurpleGrain />
    }
}