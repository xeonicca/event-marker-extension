import type {Event} from '../../index'

type AttributeListProps = {
    selectedEvent: Event;
    primaryKeys: string[];
    selectedFilterData: {[key: string]: string};
    onCheckChange: (key: string, value: string, isChecked: boolean) => void;
  };

  export const ATTRIBUTE_TITLES: {[key: string]: string} = {
    xPath: 'xPath(目標相對路徑)'
  } 

  const secondaryKeys = ['className', 'innerText', 'xPath']
  
  const AttributeList = ({selectedEvent, primaryKeys, selectedFilterData, onCheckChange}: AttributeListProps) => {
      return (
        <div className='selectedEventContainer'>
              {Object.entries(selectedEvent).map(([key, value], index) => {
                  if(!secondaryKeys.includes(key)) return null
                  return (
                    <label key={key + index} className="receivedEvent">
                        {!selectedEvent.eventName && <input type="checkbox" name={key} checked={!!selectedFilterData[key]} onChange={(e) => onCheckChange(key, value, e.target.checked)}/>}
                        {ATTRIBUTE_TITLES[key] || key}: {value}
                    </label>
                  )
              })}
          </div>
      )
  }
  
  export default AttributeList;