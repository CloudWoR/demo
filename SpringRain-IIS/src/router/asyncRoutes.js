
/**
 * Routes that require authorized access
 */
const asyncRoutesChildren = [
  // {
  //   path: '/',
  //   name: 'home',
  //   meta: {
  //     roles: ['admin', 'editor', 'test', 'supervise'],
  //     title: '主页',
  //     icon: 'home',
  //     keepAlive: true
  //   },
  //   component: () => import('../pages/home/home')
  // },
  {
    path: '/',
    name: 'workDetail',
    meta: {
      roles: ['admin', 'editor', 'supervise'],
      title: '主页',
      icon: 'home',
      keepAlive: true
    },
    component: () => import('../pages/home/dataViewer')
    // children: [
    //   {
    //     path: 'take-all',
    //     name: 'take-all',
    //     meta: {
    //       roles: ['admin', 'editor', 'supervise'],
    //       title: '数据全揽',
    //       icon: 'fas fa-pencil-alt',
    //       keepAlive: true
    //     },
    //     component: () => import('../pages/home/dataViewer')
    //   }
    // ]
  },
  {
    path: '/mammography',
    name: 'mammography',
    meta: {
      roles: ['admin', 'editor', 'supervise'],
      title: '视图编辑',
      icon: 'fas fa-user-nurse',
      keepAlive: true
    },
    component: () => import('../components/Layout/layout'),
    children: [
      {
        path: 'view-edit',
        name: 'view-edit',
        meta: {
          roles: ['admin', 'editor', 'orther', 'supervise'],
          title: '患者检查标记',
          icon: 'fas fa-pencil-alt',
          keepAlive: true
        },
        component: () => import('../pages/mammography/view-edit')
      }, {
        path: 'configure',
        name: 'configure',
        meta: {
          roles: ['admin', 'editor'],
          title: '配置项',
          icon: 'fas fa-cogs',
          keepAlive: true
        },
        component: () => import('../components/Layout/layout'),
        children: [
          {
            path: 'configure-markedIcon',
            name: 'configure-markedIcon',
            meta: {
              roles: ['admin', 'editor'],
              title: '标识图配置',
              icon: 'grain',
              keepAlive: true
            },
            component: () => import('../pages/mammography/configureMarked')
          },
          {
            path: 'configure-fields',
            name: 'configure-fields',
            meta: {
              roles: ['admin', 'editor'],
              title: '常用字段配置',
              icon: 'menu_book',
              keepAlive: true
            },
            component: () => import('../pages/mammography/configureFields')
          },
          {
            path: 'configure-dicom',
            name: 'configure-dicom',
            meta: {
              roles: ['admin', 'editor'],
              title: 'dicom配置',
              icon: 'fas fa-hdd',
              keepAlive: true
            },
            component: () => import('../pages/mammography/configureDicom')
          }
        ]
      }
    ]
  },
  {
    path: '*', // This must be placed at the bottom
    redirect: '/NoFound404',
    meta: {
      roles: ['admin', 'test', 'supervise'],
      isHidden: true
    }
  }
]

const asyncRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/',
    component: () => import('../layouts/MainLayout'),
    meta: {
      // index 应该是所有的用户都可以访问
      roles: ['admin', 'editor', 'test']
    },
    children: asyncRoutesChildren
  }
]

export default asyncRoutes
