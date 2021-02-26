export default function ({
    store,
    route,
    redirect
  }) {
      if(route.name.indexOf("brand-uuid") != -1){
        store.commit('app/setApp', route.path.split("/")[2])
      }
    // if (store.state.auth.loggedIn) {
    //   if (
    //     !store.state.auth.user.all_permissions.includes(
    //       'edit-' + route.name.replace('-form-id', '')
    //     ) &&
    //     !store.state.auth.user.all_permissions.includes(
    //       'create-' + route.name.replace('-form', '')
    //     ) &&
    //     !store.state.auth.user.all_permissions.includes('read-' + route.name) &&
    //     !store.state.auth.user.all_permissions.includes('pengaturan')
    //   ) {
    //     return redirect('/')
    //   }
    // } else {
    //   return redirect('/login')
    // }
  }
  