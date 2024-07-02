<template>
    <div>
        <div id="gridjs-table"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Grid, h } from 'gridjs';
import { adminSupabase } from '@services/supabase.js';
import { useDateFormat } from '@vueuse/core'


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

    new Grid({
        columns: ['No', 'Full Name', 'Email', 'Last Sign In At', 'Actions'],
        data: usersData,
        // search: true,
        fixedHeader: true,
        pagination: {
            enabled: true,
            limit: 10
        },className: {
    td: 'my-custom-td-class',
    table: 'bg-red-100'
  }
        
    }).render(document.getElementById('gridjs-table'));
};

const viewUser = (id) => {
    // Logic for viewing a user
    console.log('Viewing user:', id);
};

const deleteUser = (id) => {
    // Logic for deleting a user
    console.log('Deleting user:', id);
};

const updateUser = (id) => {
    // Logic for updating a user
    console.log('Updating user:', id);
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
  