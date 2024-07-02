<template>
    <div>
        <div id="gridjs-table"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Grid, h } from 'gridjs';
import { supabase } from '@services/supabase.js';
import { useDateFormat } from '@vueuse/core'


const loadUsers = async () => {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
        console.log(data);

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const usersData = data.map((user, index) => [
        index + 1,
        user.title,
        user.artist,
        user.created_name,
        useDateFormat(user.created_at, 'DD MMM, YYYY - HH:mm').value,
    ]);

    new Grid({
        columns: ['No', 'Title', 'Artist', 'Created By', 'Created At'],
        data: usersData,
        // search: true,
        fixedHeader: true,
        pagination: {
            enabled: true,
            limit: 10
        }, className: {
            td: 'whitespace-nowrap',
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
  