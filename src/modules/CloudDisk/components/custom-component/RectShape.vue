<template>
    <div class="rect-shape">
        <v-text :prop-value="element.propValue" :elementObj="element" />
    </div>
</template>

<script>
export default {
    props: {
        propValue: {
            type: String,
            require: true,
            default: '',
        },
        element: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.rect-shape {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: block;
}
</style>
