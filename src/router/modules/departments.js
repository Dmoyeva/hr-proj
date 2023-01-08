import Layout from '@/layout'
export default {
  path: '/department',
  component: Layout,
  children: [{
    name: 'department',
    path: '',
    component: () => import('@/views/departments'),
    meta: {
      title: '组织架构',
      icon: 'tree'
    }
  }]
}
