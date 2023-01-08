import Layout from '@/layout'
export default {
  path: '/salary',
  component: Layout,
  children: [{
    name: 'salary',
    path: '',
    component: () => import('@/views/salary'),
    meta: {
      title: '薪资',
      icon: 'money'
    }
  }]
}
