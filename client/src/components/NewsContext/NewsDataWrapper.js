import NewsContext from "./NewsContext"
import React from 'react'

export const withNewsDataControl = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null,
        filter: {
          newsType: []
        },
        fullData: null
      }

      this.loadData()
    }

    loadData() {
      fetch('http://tutorials-env-1.vgpdkpkjze.us-west-2.elasticbeanstalk.com/api/news')
        .then(res => res.json())
        .then(data => {
          this.setState({ data, fullData: data })
        });
    }

    handleNewsTypeFilterChange = (newsType) => {
      this.setState({ filter: { newsType } }, () => {
        console.log("UPDATING FILTER")
        const newsTypeFilterList = this.state.filter.newsType

        //Filter
        const result = this.state.fullData.filter(data => {
          if(newsTypeFilterList.length == 0) {
            return true
          }

          for(var i=0; i<newsTypeFilterList.length; i++) {
            if(data.type == newsTypeFilterList[i]){
              return true
            }
          }
          return false
        })

        console.log("RESULT: ", result)
        this.setState({ data: result }, () => console.log("filter: ", this.state))
      })

      
    }

    updateFilter = () => {
      console.log("UPDATING FILTER")
      const newsTypeFilterList = this.state.filter.newsType
      const result = this.state.data.filter(data => {
        for (var newsTypeFilter in newsTypeFilterList) {
          return data.type == newsTypeFilter
        }
      })
      this.setState({ data: result })
    }

    render() {
      return (
        <NewsContext.Provider
          value={{
            data: this.state.data,
            handleNewsTypeFilterChange: this.handleNewsTypeFilterChange
          }}
        >
          <WrappedComponent {...this.props}></WrappedComponent>
        </NewsContext.Provider>
      )
    }
  }
}

export default withNewsDataControl