<template>
    <v-list-item link :subtitle="`Size: ${(itemProps.size / 1024 / 1024).toFixed(2)} MB`" :title="itemProps.name">
        <template #prepend>
            <v-avatar class="pa-7" color="surface-light" rounded="lg" size="50">
                <v-avatar :icon="itemProps.icon" rounded>
                    <v-img :src="itemProps.coverUrl" width="100%" height="100%"></v-img>
                </v-avatar>
            </v-avatar>
        </template>
    </v-list-item>
</template>

<script setup lang="ts">
defineProps({
    itemProps: {
        type: Object,
        default: {}
    }
})
</script>

<style scoped></style>