<template>
    <div class="group-[.sidebar-expanded]/main:blur-[1px] mb-10 m-6 mt-20 h-full ${className}" v-bind="$attrs">
        <section class="mx-auto max-w-[1024px]">
            <slot></slot>
        </section>
    </div>
</template>