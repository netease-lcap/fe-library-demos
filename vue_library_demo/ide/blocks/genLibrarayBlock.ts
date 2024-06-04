import * as naslTypes from '@nasl/ast-mini';
import {
    filterProperty,
    firstLowerCase,
    NameGroup,
    genUniqueQueryNameGroup,
} from './utils';

function genGetTemplate(entity: naslTypes.Entity, nameGroup: NameGroup) {
    const properties = entity.properties.filter(filterProperty('inDetail'));
  
    return `<ULinearLayout direction="vertical">
        <UInfoList>
            <UInfoListGroup
                slotTitle={
                    <UText text="基本信息"></UText>
                }>
                ${properties.map((property) => {
        const valueExpression = `${nameGroup.viewVariableEntity}.${property.name}`;
        const detailItem = `<UInfoListItem
            slotLabel={
                <UText text="${property.label || property.name}"></UText>
            }>
            <UText text={${valueExpression}}></UText>
        </UInfoListItem>`;
        return detailItem;
        }).join('\n')}
          </UInfoListGroup>
        </UInfoList>
        <UPanel
            slotTitle={
                <UText text="胶囊选择器"></UText>
            }>
            ${genCwdCapsuleTemplate(entity, nameGroup)}
        </UPanel>
    </ULinearLayout>`;
}

function genQueryLogic(entity: naslTypes.Entity, nameGroup: NameGroup) {
    const entityLowerName = firstLowerCase(entity.name);
    const namespace = entity.getNamespace();
    return `export function ${nameGroup.logic}() {
        let result;
        result = FROM(${namespace}.${entity.name}Entity, ${entity.name} => $
            .SELECT({
                ${entityLowerName}: ${entity.name}
            }));
        return result;
    }`;
}


function genCwdCapsuleTemplate(entity: naslTypes.Entity, nameGroup: NameGroup) {
    const dataSourceValue = `app.logics.${nameGroup.logic}()`
    return `<CwdCapsule dataSource={${dataSourceValue}}></CwdCapsule>`;
}

export function genGetBlock(entity: naslTypes.Entity, refElement: naslTypes.ViewElement) {
    const likeComponent = refElement?.likeComponent;
    const namespace = entity.getNamespace();
    const entityName = entity.name;
    const entityFullName = `${namespace}.${entityName}`;
    const dataSource = entity.parentNode;
    const module = dataSource.app;
  
    // 生成唯一name
    // 加到页面上的params、variables、logics等都需要唯一name
    // 页面上有ref引用的element也需要唯一name
    const viewElementMainView = likeComponent.getViewElementUniqueName('cwdCapsule');
    const nameGroup: NameGroup = genUniqueQueryNameGroup(module, likeComponent, viewElementMainView);
    nameGroup.viewParamId = likeComponent.getParamUniqueName('id');
    nameGroup.viewVariableEntity = likeComponent.getVariableUniqueName(firstLowerCase(entity.name));
    nameGroup.viewLogicLoad = likeComponent.getLogicUniqueName('load');
  
    return `export function view(${nameGroup.viewParamId}: Long) {
      let ${nameGroup.viewVariableEntity}: ${entityFullName};
  
      const $lifecycles = {
          onCreated: [
              function ${nameGroup.viewLogicLoad}() {
                  ${nameGroup.viewVariableEntity} = ${namespace}.${entity.name}Entity.get(${nameGroup.viewParamId})
              },     
          ]      
      }
  
      return ${genGetTemplate(entity, nameGroup)}
    }
    export namespace app.logics {
        ${genQueryLogic(entity, nameGroup)}
    }`;
  }