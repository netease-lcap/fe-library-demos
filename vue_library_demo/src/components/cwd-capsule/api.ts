/// <reference types="@nasl/types" />
namespace extensions.vue_library_demo.viewComponents {
  const { Component, Prop, ViewComponent, Slot, Method, Event, ViewComponentOptions } = nasl.ui;

  @ExtensionComponent({
    type: 'pc',
  })
  @Component({
    title: '胶囊选择器',
    description: '胶囊选择器',
    group: 'Form',
  })
  export class CwdCapsule extends ViewComponent {
    constructor(options?: Partial<CwdCapsuleOptions>) {
      super();
    }
  }

  export class CwdCapsuleOptions extends ViewComponentOptions {
    @Prop({
      title: '数据',
      description: '数据源，如：[{ label: \'月销售统计\', value: \'month\' }]',
      designerValue: [{ label: "月销售统计",value: "month"},{ label: "年销售统计",value: "year"}],
      setter: {
        concept: 'InputSetter'
      }
    })
    data: nasl.collection.List<{ label: nasl.core.String, value: nasl.core.String }>;

    @Prop({
      title: '内容',
      description: '显示文本',
      sync: true,
      setter: {
        concept: 'InputSetter'
      }
    })
    value: nasl.core.String;

    @Event({
      title: '值改变',
      description: '切换选项时触发',
    })
    onChange: (event: nasl.core.String) => void;
  }
}
