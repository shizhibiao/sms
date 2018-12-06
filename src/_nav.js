export default {
  items: [
    {
      title: true,
      name: '首页',
      wrapper: {
        element: 'span',
        attributes: {}
      },
      class: 'text-center'
    },
    {
      name: '我的待办',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: '构型',
      wrapper: {
        element: 'span',
        attributes: {}
      },
      class: 'text-center'
    },
    {
      name: '飞机信息',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: '  新增/编辑',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '  查询',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '  审核',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '  历史版本',
          url: '/base/cards',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: '机载性能',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: '新增/编辑',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '查询',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '审核',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '历史版本',
          url: '/base/cards',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: '机载设备',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: '新增/编辑（设备）',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '新增/编辑（机型）',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '查询',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '审核（设备）',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '审核（机型）',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '历史版本',
          url: '/base/cards',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: '飞机改装',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: '新增/编辑',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '查询',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '审核',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '历史版本',
          url: '/base/cards',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: '失效跳开关',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: '新增/编辑',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '查询',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '审核',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: '历史版本',
          url: '/base/cards',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      title: true,
      name: '系统',
      wrapper: {
        element: 'span',
        attributes: {}
      },
      class: 'text-center'
    },
    {
      name: '用户管理',
      url: '/base',
      icon: 'icon-puzzle'
    },
    {
      name: '角色管理',
      url: '/buttons',
      icon: 'icon-cursor'
    }
  ]
}
