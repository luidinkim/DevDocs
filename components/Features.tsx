export default function Features() {
  const features = [
    {
      icon: '📚',
      title: '체계적인 구조',
      description: '논리적으로 구성된 문서 계층 구조'
    },
    {
      icon: '🔍',
      title: '강력한 검색',
      description: '빠르고 정확한 전문 검색 기능'
    },
    {
      icon: '🌙',
      title: '다크 모드',
      description: '눈이 편안한 다크 테마 지원'
    },
    {
      icon: '🌏',
      title: '다국어 지원',
      description: '한국어와 영어 콘텐츠 제공'
    },
    {
      icon: '📱',
      title: '반응형 디자인',
      description: '모든 기기에서 최적화된 경험'
    },
    {
      icon: '⚡',
      title: '빠른 로딩',
      description: '정적 생성으로 빠른 페이지 로드'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
      {features.map((feature, index) => (
        <div key={index} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="text-3xl mb-3">{feature.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}