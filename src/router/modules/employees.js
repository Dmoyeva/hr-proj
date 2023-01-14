import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      name: 'Employees',
      path: '',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    {
      name: 'Detail',
      path: 'detail/:id?',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true,
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      name: 'Print',
      path: 'print/:id',
      component: () => import('@/views/employees/print.vue'),
      hidden: true,
      meta: {
        title: '打印信息' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    }
  ]
}
