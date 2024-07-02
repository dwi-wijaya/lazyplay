<template>
    <div>
        <div id="gridjs-table"></div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { Grid, h } from 'gridjs';
import { adminSupabase } from '@/services/supabase.js'; // sesuaikan path sesuai struktur proyek Anda
import { useDateFormat } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();
const gridInstance = ref(null);

const loadUsers = async () => {
    const { data, error } = await adminSupabase.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const usersData = data.users.map((user, index) => [
        index + 1,
        user.user_metadata.full_name || user.name,
        user.email,
        useDateFormat(user.last_sign_in_at, 'DD MMM, YYYY - HH:mm').value,
        h('div', { className: 'action-buttons flex gap-1 w-fit' }, [
            h('button', {
                onClick: () => viewUser(user.id)
            }, h('i', { className: 'btn act-btn fad fa-eye' })),
            h('button', {
                onClick: () => deleteUser(user.id)
            }, h('i', { className: 'btn act-btn fad fa-trash' })),
            h('button', {
                onClick: () => updateUser(user.id)
            }, h('i', { className: 'btn act-btn fad fa-edit' }))
        ])
    ]);

    // Clear the container before rendering the Grid
    const container = document.getElementById('gridjs-table');
    container.innerHTML = '';

    // Initialize Grid.js or update it
    if (gridInstance.value) {
        gridInstance.value.updateConfig({ data: usersData }).forceRender();
    } else {
        gridInstance.value = new Grid({
            columns: ['No', 'Full Name', 'Email', 'Last Sign In At', 'Actions'],
            data: usersData,
            search: true,
            fixedHeader: true,
            pagination: {
                enabled: true,
                limit: 10
            }
        }).render(container);
    }
};

const viewUser = (id) => {
    router.push({ path: `/users/view/${id}` });
};

const deleteUser = async (id) => {
    const { error } = await adminSupabase.auth.admin.deleteUser(id);
    if (error) {
        console.error('Error deleting user:', error);
    } else {
        console.log('User deleted:', id);
        await loadUsers(); // Refresh the user list after deletion
    }
};

const updateUser = (id) => {
    router.push({ path: `/users/edit/${id}` });
};

onMounted(async () => {
    await loadUsers();
});
</script>
  
<style scoped>
.action-buttons button {
    margin-right: 5px;
}
</style>
  