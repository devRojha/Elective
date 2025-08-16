'use client'

// import DotGrid from "./DotGrid";
import Particles from "./Particles";


export default function BackgroundStyle () {

    return (
        <>
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />

            {/* <DotGrid
                dotSize={4}
                gap={15}
                baseColor="#HHHHHH"
                activeColor="#5227FF"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
            /> */}

        </>
    )
}