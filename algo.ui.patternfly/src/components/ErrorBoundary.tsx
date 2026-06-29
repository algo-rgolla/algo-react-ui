import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, AlertGroup } from '@patternfly/react-core'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: 'Something went wrong while rendering this page.',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Unexpected UI error.',
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('UI render error:', { error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <AlertGroup isToast>
          <Alert variant="danger" title={this.state.message} />
        </AlertGroup>
      )
    }

    return this.props.children
  }
}
