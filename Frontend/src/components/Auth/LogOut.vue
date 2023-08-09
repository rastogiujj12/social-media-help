<template>
    <div class="container">
        Logout
    </div>
</template>

<script>
export default {
    mounted(){
        this.init()
    },
    methods:{
        init(){
            this.$buefy.toast.open({
                duration: 2000,
                message: "Logged out",
                position: "is-top",
                type: "is-danger",
            });
            this.$store.dispatch("logout");
        }
    }
}
</script>