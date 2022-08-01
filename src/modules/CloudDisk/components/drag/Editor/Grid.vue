<template>
    <svg
        class="grid"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern
                id="smallGrid"
                width="51"
                height="72.3"
                patternUnits="userSpaceOnUse"
            >
                <path 
                    d="M 51 0 L 0 0 0 72.3" 
                    fill="none" 
                    stroke="rgba(186, 186, 186, 0.4)" 
                    stroke-width="1"
                >
                </path>
            </pattern>
            <pattern
                id="grid"
                width="102.84 "
                height="145.476"
                patternUnits="userSpaceOnUse"
            >
            <!-- 514.20   727.38 -->
            <!-- 257.1  363.9 -->
            <!-- 171.4  242.46 -->
            <!-- 128.55  181.845 -->
            <!-- 102.84  145.476 -->
                <rect width="102.84 " height="145.476" fill="url(#smallGrid)"></rect>
                <path 
                    d="M 102.84  0 L 0 0 0 145.476" 
                    fill="none" 
                    stroke="rgba(186, 186, 186, 1)" 
                    stroke-width="1"
                >
                </path>
            </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)"></rect>
    </svg>
</template>

<style lang="scss" scoped>
.grid {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
