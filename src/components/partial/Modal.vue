<script>
export default {
    name: 'Modal',
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
</script>

<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="rounded-lg bg-container mx-6" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
                <header class="flex flex-col relative pt-16 p-4" id="modalTitle">
                    <button type="button" class="absolute right-4 top-4" @click="close" aria-label="Close modal">
                        <i class="fad fa-xmark"></i>
                    </button>
                    <slot name="header">
                        This is the default tile!
                    </slot>
                </header>

                <section class="p-4  border-b border-stroke" id="modalDescription">
                    <slot name="body">
                        This is the default body!
                    </slot>
                </section>

                <footer class="p-4">
                    <slot name="footer">
                        This is the default footer!
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<style>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal {
    background: #FFFFFF;
    /* box-shadow: 2px 2px 20px 1px; */
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.modal-header,
.modal-footer {
    padding: 15px;
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
}

.btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .5s ease;
}
</style>