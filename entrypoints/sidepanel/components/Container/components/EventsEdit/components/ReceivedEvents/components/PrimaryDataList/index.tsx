type PrimaryDataListProps = {
  primaryDataList: [string, string][];
};

const TITLE: {[key: string]: string} = {
  eventType: '事件類型',
  trackSection: '事件區塊',
  trackId: '事件 id'
} 

const PrimaryDataList = ({primaryDataList}: PrimaryDataListProps) => {
    return (
      <div className='primaryDataContainer'>
        {primaryDataList.map(([key, value], index) => 
          {
            if(!value) return null;
            return (
              <label key={key + index} className="primaryData">
                {TITLE[key]}: {value}
              </label>
            )
          }
        )}
      </div>
    )
}

export default PrimaryDataList;