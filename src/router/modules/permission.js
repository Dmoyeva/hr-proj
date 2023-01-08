import Layout from '@/layout'
export default {
  path: '/permissions',
  component: Layout,
  children: [
    {
      name: 'permissions',
      path: '',
      component: () => import('@/views/permission'),
      meta: {
        title: '权限',
        icon: 'lock'
      }
    }
  ]
}
